class button {
    constructor (text, pencil, color) {
        this.text = text;
        this.pencil = pencil;
        this.color = color;
        this.button = createButton(text);
    }

    setBackgroundColor(color) {
        button.style('background-color', color);
    }

    onClick() {
        this.pencil.setColor(this.color);
    }
}
