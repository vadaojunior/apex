export const rateLimit = (options: {
    interval: number
    uniqueTokenPerInterval: number
}) => {
    const tokenCache = new Map<string, number[]>()

    return {
        check: (limit: number, token: string) => {
            return new Promise<void>((resolve, reject) => {
                const now = Date.now()
                const timestamps = tokenCache.get(token) || []

                // Remoção de timestamps velhos que já saíram da janela de intervalo
                const activeTimestamps = timestamps.filter((t) => now - t < options.interval)

                if (activeTimestamps.length >= limit) {
                    reject(new Error('Rate limit exceeded'))
                } else {
                    activeTimestamps.push(now)
                    tokenCache.set(token, activeTimestamps)

                    // Para controle de memória: Limpar timestamps periodicamente dos registros inativos
                    if (tokenCache.size > options.uniqueTokenPerInterval) {
                        const firstKey = tokenCache.keys().next().value
                        if (firstKey) tokenCache.delete(firstKey)
                    }

                    resolve()
                }
            })
        },
    }
}
