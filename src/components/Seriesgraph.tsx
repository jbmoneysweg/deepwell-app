import React, { useEffect, useState } from 'react';
import { Chart }  from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

const Seriesgraph: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.boresite.io/storage/v1/object/public/assessment/data.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            //const timestampLabels = data.data[0].map((timestamp: number) => new Date(timestamp * 1000).toLocaleDateString());

            const timestampLabels = data.data[0].map((timestamp: number) => {
                const date = new Date(timestamp * 1000);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
            });

            const tubingPressureData = {
                labels: timestampLabels,
                datasets: [
                    {
                        label: 'Tubing Pressure (psi)',
                        data: data.data[2],
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    }
                ]
            };

            const casingPressureData = {
                labels: timestampLabels,
                datasets: [
                    {
                        label: 'Casing Pressure (psi)',
                        data: data.data[3],
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    }
                ]
            };

            const depthData = {
                labels: timestampLabels,
                datasets: [
                    {
                        label: 'Depth (ft)',
                        data: data.data[1],
                        borderColor: 'rgb(54, 162, 235)',
                        fill: false
                    }
                ]
            };

            const createChart = (canvasId: string, chartData: any) => {
                const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
                Chart.register(zoomPlugin)
                new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Timestamp'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: canvasId === 'myChart1' ? 'Tubing Pressure' : (canvasId === 'myChart2' ? 'Casing Pressure' : 'Depth')
                                }
                            }
                        },
                        plugins: {
                            zoom: {
                                zoom: {
                                    wheel: {
                                        enabled: true,
                                    },
                                    pinch: {
                                        enabled: true
                                    },
                                    mode: 'xy'
                                }
                            }
                        }
                    }
                });
            };

            createChart('myChart1', tubingPressureData);
            createChart('myChart3', depthData);
            createChart('myChart2', casingPressureData);
            
        }
    }, [data]);

    const handleChartButtonClick = (name: String) => {
        var charts = document.getElementsByClassName("chart-canvas");
        for (var i = 0; i < charts.length; i++) {
            charts[i].style.display = "none";
        }
        document.getElementById(name).style.display = "block";
    };

    return (
        <div>
            <div>
                        <button onClick={() => handleChartButtonClick('myChart1')}>Tubing Pressure Chart</button>
                        <button onClick={() => handleChartButtonClick('myChart2')}>Casing Pressure Chart</button>
                        <button onClick={() => handleChartButtonClick('myChart3')}>Depth Chart</button>
                    </div>
            {data ? (
                <div style={{ display: 'flex',  flexDirection: 'column'}}>
                    <canvas id="myChart1" className="chart-canvas" style={{ display: 'none'}}></canvas>
                    <canvas id="myChart2" className="chart-canvas" style={{ display: 'none'}}></canvas>
                    <canvas id="myChart3" className="chart-canvas" style={{ display: 'none'}}></canvas>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Seriesgraph;