export const AddSource = ({
    boxes,
    setBoxes
}) => {
    function addSourceAction() {
        let nextKey = parseInt(Object.keys(boxes).slice(-1)) + 1
        let updatedBoxes = Object.assign({}, boxes, { [nextKey] : { top: 180, left: 20, title: 'New Source ' + nextKey } })
        setBoxes(updatedBoxes)
    }
    return (
        <div>
            <button className="group rounded-lg border border-neutral-700 bg-neutral-800/30 px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-700" onClick={addSourceAction}>Add Source</button>
        </div>
    )
}