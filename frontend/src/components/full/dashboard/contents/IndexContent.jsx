function IndexContent() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: '1',
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <h3 style={{
                color: 'ccc',
                fontSize: '2em',
                textAlign: 'center',
                maxWidth: '80%',
            }}>Bem vindo ao seu dashboard!</h3>
        </div>
    )
}

export default IndexContent;