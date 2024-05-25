import React, { useEffect, useState } from 'react';

const UserProject = ({ token }) => {
    const [xpTransactions, setXPTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProjectPart, setSelectedProjectPart] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    useEffect(() => {
        const getUserXPTransactions = async () => {
            try {
                const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
                    method: "POST",
                    headers: {
                        "Authorization": 'Bearer ' + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        query: `query {
                            transaction(where: { type: { _eq: "xp" } }) {
                                type
                                amount
                                objectId
                                object {
                                    name
                                }
                                userId
                                createdAt
                                path
                            }
                        }`,
                    })
                });

                const result = await response.json();
                setXPTransactions(result.data.transaction);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        getUserXPTransactions();
    }, [token]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    const projectParts = Array.from(new Set(xpTransactions.map(transaction => {
        const pathParts = transaction.path.split('/').filter(Boolean);
        return pathParts[1];
    })));

    const filteredTransactions = selectedProjectPart
        ? xpTransactions.filter(transaction => {
            const pathParts = transaction.path.split('/').filter(Boolean);
            return pathParts[1] === selectedProjectPart;
        })
        : xpTransactions;

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (filteredTransactions.length > transactionsPerPage) {
        const pageButtons = [];

        for (let i = 1; i <= totalPages; i++) {
            const startIdx = (i - 1) * transactionsPerPage;
            const endIdx = i * transactionsPerPage;
            const pageTransactions = filteredTransactions.slice(startIdx, endIdx);

            if (pageTransactions.length > 0) {
                pageButtons.push(
                    <li key={i} style={{ margin: '5px' }}>
                        <button onClick={() => paginate(i)}>{i}</button>
                    </li>
                );
            }
        }

        return (
            <div className='user-project'>
                <h1>XP Transactions</h1>
                <select
                    value={selectedProjectPart}
                    onChange={(e) => setSelectedProjectPart(e.target.value)}
                    style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
                >
                    <option value="">Select Project</option>
                    {projectParts.map((part, index) => (
                        <option key={index} value={part}>{part}</option>
                    ))}
                </select>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {currentTransactions.map((transaction, index) => {
                        const pathParts = transaction.path.split('/').filter(Boolean);
                        return (
                            <div key={index} style={{ width: '100%', marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'olive', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                <p><strong><span className="red-label">Type:</span></strong> {transaction.type}</p>
                                <p><strong><span className="red-label">Amount:</span></strong> {transaction.amount}</p>
                                <p><strong><span className="red-label">Object Name:</span></strong> {transaction.object.name}</p>
                                <p><strong><span className="red-label">Created:</span></strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                <ul style={{ padding: 0, listStyle: 'none' }}>
                                    {pathParts.map((part, partIndex) => (
                                        partIndex === 1 && (
                                            <React.Fragment key={partIndex}>
                                                <p style={{ margin: 0 }}><strong><span className="red-label">Project:</span></strong> {part}</p>
                                            </React.Fragment>
                                        )
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0, flexWrap: 'wrap' }}>
                        {pageButtons}
                    </ul>
                </div>
            </div>
        );
    } else {
        return (
            <div className='user-project'>
                <h1>XP Transactions</h1>
                <select
                    value={selectedProjectPart}
                    onChange={(e) => setSelectedProjectPart(e.target.value)}
                    style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
                >
                    <option value="">Select Project Part</option>
                    {projectParts.map((part, index) => (
                        <option key={index} value={part}>{part}</option>
                    ))}
                </select>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {currentTransactions.map((transaction, index) => {
                        const pathParts = transaction.path.split('/').filter(Boolean);
                        return (
                            <div key={index} style={{ width: '100%', marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'olive', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                <p><strong><span className="red-label">Type:</span></strong> {transaction.type}</p>
                                <p><strong><span className="red-label">Amount:</span></strong> {transaction.amount}</p>
                                <p><strong><span className="red-label">Object Name:</span></strong> {transaction.object.name}</p>
                                <p><strong><span className="red-label">Created:</span></strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                <ul style={{ padding: 0, listStyle: 'none' }}>
                                    {pathParts.map((part, partIndex) => (
                                        partIndex === 1 && (
                                            <React.Fragment key={partIndex}>
                                                <p style={{ margin: 0 }}><strong><span className="red-label">Project:</span></strong> {part}</p>
                                            </React.Fragment>
                                        )
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
};

export default UserProject;
