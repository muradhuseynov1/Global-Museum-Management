const loginStyles = {
    mainContainer: {
        bgcolor: '#123456',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
    },
    formContainer: {
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        p: 2
    },
    form: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submitButton: {
        mt: 3,
        mb: 2
    },
    linkContainer: {
        textAlign: 'center',
        mt: 2
    }
};

export default loginStyles;
