class Button {
    constructor (text, color, parent, location) {
        this.text = text;
        this.color = color;

        this.button = createButton(text);
        this.button.parent(parent);
        this.button.position(location.posX, location.posY);
        this.button.mousePressed(() => {
            console.log("BUTONA TIKLAMA YETENEĞİ VERDİM!");
            this.onClick();
        });
        this.setBackgroundColor(color);
    }

    setBackgroundColor(colorParam) {
        this.button.style('background-color', color(colorParam.R, colorParam.G, colorParam.B, 255));
    }

    onClick() {
        console.log("İNATLA BUTONA TIKLIYORUM.");
        pencil.setDrawColor(this.color);
    }
}