import JWT from 'expo-jwt';
const key = 'DYBjNfubgN8tbYMGkx8TwXpQdQVx9tzkDCR23dFkxPYUfywRqzAYDZb54uJTJHkx8TwXpQdQVx9tzkDCR23dFBuDHwmvbwnePYUfywRqzAYD'

export default (data) => {
    return JWT.encode(data, key);
}