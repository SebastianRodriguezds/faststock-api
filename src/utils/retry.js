async function withRetry (fn, retries = 3, delay=200) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) {
                throw err;
            }
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

module.exports = { withRetry };