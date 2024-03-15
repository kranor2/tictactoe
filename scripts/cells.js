const Cell = function() {
    let value = null;

    const getValue = () => value;

    const changeValue = (marker) => value = marker;

    return {getValue, changeValue}
}

export default Cell;