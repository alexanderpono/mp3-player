export const findNodeWithDataAttr = (
    node: HTMLElement,
    attr: string,
    maxDepth: number = 0
): HTMLElement | null => {
    let target: HTMLElement = node;
    let depth = 0;
    while (typeof target.dataset[attr] === 'undefined' && depth < maxDepth) {
        target = target.parentElement as HTMLElement;
        depth++;
    }

    if (typeof target.dataset[attr] === 'undefined') {
        console.error('DOM node is not found. node=, attr=, depth=', node, ',', attr, ',', depth);
        return null;
    }
    return target;
};

export const doesHit = (
    elem: HTMLElement,
    event: React.MouseEvent<Element, MouseEvent>
): boolean => {
    const bounds = elem.getBoundingClientRect();
    const hitX = event.clientX >= bounds.left && event.clientX <= bounds.right;
    const hitY = event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    return hitX && hitY;
};
