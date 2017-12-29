class Button {
    constructor (text, color, parent, location) {
        this.text = text;
        this.color = color;

        console.log("This color: " + this.color);
        this.button = createButton(text);
        this.button.parent(parent);
        this.button.position(location.posX, location.posY);
        this.button.mousePressed(this.onClick);
        this.setBackgroundColor(color);
    }

    setBackgroundColor(color) {
        this.button.style('background-color', color);
    }

    onClick() {
        pencil.setDrawColor(this.color);
        console.log("Pencil color set as: " + pencil.color);
    }
}