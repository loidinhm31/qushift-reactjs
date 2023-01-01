const Alert = (props: any) => {
    return (
        <div className={"alert " + props.className} role="alert">
            {props.message}
        </div>
    )
}

export default Alert;