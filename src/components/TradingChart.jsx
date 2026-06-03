
import { useEffect, useRef } from 'react';
import { createChart, AreaSeries } from 'lightweight-charts';

const TradingChart = ({ onPriceUpdate }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const seriesRef = useRef();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
            },
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.2,
                    bottom: 0.2,
                },
            },
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: true,
            },
            crosshair: {
                horzLine: {
                    visible: true,
                    labelVisible: true,
                },
                vertLine: {
                    visible: true,
                    labelVisible: true,
                },
            },
            handleScroll: true,
            handleScale: true,
        });

        const series = chart.addSeries(AreaSeries, {
            lineColor: '#2196f3',
            topColor: 'rgba(33, 150, 243, 0.4)',
            bottomColor: 'rgba(33, 150, 243, 0.0)',
            lineWidth: 2,
            priceLineVisible: true,
            lastValueVisible: true,
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        });

        chartRef.current = chart;
        seriesRef.current = series;

        // Deriv API setup (App ID 1089 is common public ID)
        const app_id = 1089;
        const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);

        ws.onopen = () => {
            // Request historical ticks and subscribe to updates
            ws.send(JSON.stringify({
                ticks_history: "R_100", // Volatility 100 Index
                adjust_start_time: 1,
                count: 100, // Load last 100 ticks
                end: "latest",
                start: 1,
                style: "ticks",
                subscribe: 1
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // Handle historical data
            if (data.history) {
                const historyData = data.history.prices.map((price, idx) => ({
                    time: data.history.times[idx],
                    value: parseFloat(price)
                }));
                series.setData(historyData);
                
                // Update parent with latest historical price
                if (onPriceUpdate && historyData.length > 0) {
                    const last = historyData[historyData.length - 1];
                    onPriceUpdate({
                        price: last.value,
                        change: 0,
                        changePercent: 0
                    });
                }
            }

            // Handle real-time updates
            if (data.tick) {
                const tick = data.tick;
                const price = parseFloat(tick.quote);
                const time = parseInt(tick.epoch);

                series.update({
                    time: time,
                    value: price,
                });

                if (onPriceUpdate) {
                    onPriceUpdate({
                        price,
                        // Deriv ticks don't include open/close directly like klines
                        // so we estimate or just show the price
                        change: 0, 
                        changePercent: 0
                    });
                }
            }
        };

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            ws.close();
            chart.remove();
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
};

export default TradingChart;
