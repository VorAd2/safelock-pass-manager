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
                fontSize: '2em',
                textAlign: 'center',
                maxWidth: '80%',
                color: 'white'
            }}>Welcome to your dashboard!</h3>
        </div>
    )
}

export default IndexContent;