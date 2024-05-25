import React from 'react';

const PieChart = ({ data }) => {
    const chartSize = 400; // Размер диаграммы
    const radius = chartSize / 2; // Радиус диаграммы
    const filteredData = Object.entries(data).filter(([key]) => key !== 'total'); // Удаление 'total'
    const total = filteredData.reduce((acc, [_, value]) => acc + value, 0); // Общая сумма всех значений

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent) * radius;
        const y = Math.sin(2 * Math.PI * percent) * radius;
        return [x, y];
    };

    let cumulativePercent = 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartSize} ${chartSize}`}>
                <g transform={`translate(${radius}, ${radius})`}>
                    {filteredData.map(([skill, value], index) => {
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                        cumulativePercent += value / total;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

                        const largeArcFlag = value / total > 0.5 ? 1 : 0;

                        const pathData = [
                            `M ${startX} ${startY}`, // Move
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                            `L 0 0`, // Line
                        ].join(' ');

                        return (
                            <g key={skill}>
                                <path d={pathData} fill={`hsl(${index * 360 / filteredData.length}, 70%, 50%)`} />
                                <text
                                    transform={`translate(${(startX + endX) / 2 * 0.6}, ${(startY + endY) / 2 * 0.6})`}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill="#000"
                                    fontSize="10"
                                >
                                    {skill.replace('skill_', '')}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default PieChart;
