import React from 'react';

// Компонент для столбчатой диаграммы
const BarChart = ({ data, style }) => {
    const barWidth = 20; // Ширина каждого столбца
    const barSpacing = 20; // Расстояние между столбцами
    const chartHeight = 400; // Высота диаграммы
    const chartWidth = Object.keys(data).length * (barWidth + barSpacing); // Ширина диаграммы
    const maxValue = Math.max(...Object.values(data)); // Максимальное значение для масштабирования

    return (
        <div style={{ ...style, overflowX: 'auto' }}>
            <svg width="100%" height="95%" viewBox={`0 0 ${chartWidth + 100} ${chartHeight + 100}`}>
                <g transform="translate(50, 10)">
                    {/* Ось Y */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#333" />
                    {/* Подписи к оси Y */}
                    {Array.from({ length: 6 }, (_, i) => (
                        <text key={i} x="-10" y={(chartHeight / 5) * i} textAnchor="end" fontSize="12" fill="#333">
                            {Math.round(maxValue - (maxValue / 5) * i)}
                        </text>
                    ))}
                    {Object.entries(data).map(([skill, value], index) => (
                        <g key={skill} transform={`translate(${index * (barWidth + barSpacing)}, 0)`}>
                            {/* Столбец */}
                            <rect
                                x="0"
                                y={chartHeight - (value / maxValue) * chartHeight}
                                width={barWidth}
                                height={(value / maxValue) * chartHeight}
                                fill="#3f51b5"
                                rx="5"
                            />
                            {/* Значение столбца */}
                            <text
                                x={barWidth / 2}
                                y={chartHeight - (value / maxValue) * chartHeight - 10}
                                fontSize="12"
                                textAnchor="middle"
                                fill="#333"
                            >
                                {value}
                            </text>
                            {/* Название навыка под углом 45 градусов */}
                            <text
                                x={barWidth / 2}
                                y={chartHeight + 20}
                                fontSize="12"
                                textAnchor="middle"
                                fill="#333"
                                transform={`rotate(45, ${barWidth / 2}, ${chartHeight + 20})`}
                            >
                                {skill.replace('skill_', '')}
                            </text>
                        </g>
                    ))}
                    {/* Ось X */}
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#333" />
                </g>
            </svg>
        </div>
    );
};

export default BarChart;
