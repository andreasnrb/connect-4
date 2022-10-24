/**
 * A Button that clicks. Nothing more nothing less.
 *
 * @param props
 * @constructor
 */
function Button(props:any) {
    return <button onClick={props.onClick}>{props.children}</button>
}

export default Button;