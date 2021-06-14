import {p5, testRendering} from '../../lib';

describe('Typography', function() {
    this.timeout(0);

    // https://p5js.org/reference/#/p5/loadFont
    describe('loadFont', function() {
        it('should load font', async function() {
            let myFont;
            return testRendering({
                before: async function(p) {
                    myFont = await new Promise((resolve, reject) => {
                        p.loadFont('https://unpkg.com/font-awesome@4.7.0/fonts/FontAwesome.otf', resolve, reject);
                    })
                },
                draw: function(p) {
                    p.fill('#ED225D');
                    p.textFont(myFont);
                    p.textSize(36);
                    p.text("\uf092", 10, 50);
                }
            })
        });
    });

});