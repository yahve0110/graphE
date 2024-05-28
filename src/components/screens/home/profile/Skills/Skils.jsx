import React, { useState, useEffect } from 'react';
import BarChart from '../../charts/BarChart.jsx';
import PieChart from "../../charts/PieChart.jsx";

const Skills = ({ token }) => {
    const [totalSkill, setTotalSkill] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
                    method: "POST",
                    headers: {
                        "Authorization": 'Bearer ' + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        query: `query {
                            user {
                                id
                            }
                        }`,
                    })
                });

                const result = await response.json();
                const user = result.data.user[0];
                setUserId(user.id);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchUserId();
    }, [token]);

    useEffect(() => {
        if (userId) {
            const getTotalSkills = async () => {
                try {
                    const limit = 100;
                    let skillsOffset = 0;
                    let totalSkillArr = [];
                    let totalSkill = {};
                    let hasMoreData = true;

                    while (hasMoreData) {
                        const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
                            method: "POST",
                            headers: {
                                "Authorization": 'Bearer ' + token,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                query: `query {
                                    transaction (limit:${limit}, offset:${skillsOffset}, where:{
                                        _and:[{userId:{_eq:${userId}}},{type:{_ilike:"%skill%"}}]
                                        }
                                    ){
                                        type
                                        amount
                                        objectId
                                        object{
                                            name
                                        }
                                        createdAt
                                        path
                                    }
                                }`,
                            })
                        });

                        const result = await response.json();

                        if (result.data.transaction.length > 0) {
                            totalSkillArr.push(...result.data.transaction);
                            skillsOffset += limit;
                        } else {
                            hasMoreData = false;
                        }
                    }

                    totalSkillArr.forEach(skill => {
                        if (!totalSkill.hasOwnProperty(skill.type)) {
                            totalSkill[skill.type] = skill.amount;
                        } else {
                            totalSkill[skill.type] += skill.amount;
                        }
                    });

                    let total = 0;
                    for (let key in totalSkill) {
                        total += totalSkill[key];
                    }
                    totalSkill.total = total;

                    setTotalSkill(totalSkill);
                    setIsLoading(false);
                } catch (error) {
                    setError(error);
                    setIsLoading(false);
                }
            };

            getTotalSkills();
        }
    }, [token, userId]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    const filteredSkills = Object.entries(totalSkill);

    return (
        <div style={{padding: '20px', maxWidth: '100%', boxSizing: 'border-box'}}>
            <h1>Skills</h1>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px'}}>
                <BarChart data={totalSkill}
                          style={{flex: '1 1 45%', maxWidth: '100%', minWidth: '300px', boxSizing: 'border-box'}}/>
                <PieChart data={totalSkill}
                          style={{flex: '1 1 45%', maxWidth: '100%', minWidth: '300px', boxSizing: 'border-box'}}/>
            </div>
            <ul style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '20px',
                padding: '0',
                listStyleType: 'none',
                boxSizing: 'border-box',
                margin: '0',
            }}>
                {filteredSkills.map(([skill, value]) => (
                    <li key={skill} style={{
                        marginBottom: '10px',
                        width: 'calc(50% - 10px)',
                        minWidth: '150px',
                        boxSizing: 'border-box',
                    }}>
                        <strong><span className="red-label">{skill.replace('skill_', '')}:</span></strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Skills;
