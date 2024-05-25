import React, { useEffect, useState } from 'react';

const UserProfile = ({ token }) => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
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
                                login
                                campus
                                firstName
                                lastName
                                email
                                auditRatio
                            }
                        }`,
                    })
                });

                const result = await response.json();
                // console.log(result);
                setUser(result.data.user[0]);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        getUserProfile();
    }, [token]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <div>
            <p><span className="red-label">ID:</span> {user.id}</p>
            <p><span className="red-label">Login:</span> {user.login}</p>
            <p><span className="red-label">Name:</span> {user.firstName}</p>
            <p><span className="red-label">LastName:</span> {user.lastName}</p>
            <p><span className="red-label">Email:</span> {user.email}</p>
            <p><span className="red-label">Campus:</span> {user.campus}</p>
            <p><span className="red-label">Audit:</span> {user.auditRatio}</p>
        </div>
    );
};

export default UserProfile;
