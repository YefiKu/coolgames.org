class Game {
    context = null;
    stopped = false;
    blocks = [];
    bound = [];
    constructor(context, blocks) {
        this.context = context;
        this.blocks = blocks || [];
    }
    start() {
        this.stopped = false;
        let loop = () => {
            this.blocks.forEach((block,i) => {
                block.move(...block.speed);
                if (block.oncollide) {
                    this.blocks.forEach(b => {
                        if (b == block || b.intouchable) return;
                        let c = this.collision(block,b);
                        c.length && block.oncollide(c,b);
                    })
                    let c = this.collisionWithCanvas(block);
                    c.length && block.oncollide(c,'canvas');
                }
            })
            this.draw();
            this.stopped || setTimeout(loop, 5);
        }
        loop();
    }
    find(sel) {
        return this.blocks.filter(b =>b.selector == sel);
    }
    remove(block) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
        block.onremove?.();
    }
    stop() {
        this.stopped = true;
    }
    collision(block1, block2) {
        let collisions = [];
        for (let r1 of block1.rects) {
            for (let r2 of block2.rects) {
                let [centre1, centre2] = [[r1[0] + r1[2]/2, r1[1] + r1[2]/2], [r2[0] + r2[2]/2, r2[1] + r2[3]/2]];
                let distance = [centre1[0] - centre2[0], centre1[1] - centre2[1]];
                let direction = [-1,-1];
                if (distance[0] > 0) (direction[0]=1) + (distance[0]*=-1);
                if (distance[1] > 0) (direction[1]=1) + (distance[1]*=-1);
                distance[0] += (r1[2]+r2[2])/2;
                distance[1] += (r1[3]+r2[3])/2;
                if (distance[0] < 0 || distance[0] > r1[2]) direction[0] = 0;
                if (distance[0] < 0 || distance[0] > r1[2]) direction[0] = 0;
                if (distance.every(n => n>0) && !collisions.map(e=>e.toString()).includes(distance.toString())) collisions.push([distance,direction]);
            }
        }
        return collisions;
    }
    collisionWithCanvas(block) {
        let collisions = [];
        for (let r of block.rects) {
            let direction = [0,0];
            let distance = [0,0];
            if (r[0] < 0) {
                direction[0] = -1;
                distance[0] = r[0];
            } else if (r[0]+r[2] > this.context.canvas.width) {
                direction[0] = 1;
                distance[0] = this.context.canvas.width - r[0] - r[2];
            }
            if (r[1] < 0) {
                direction[1] = -1;
                distance[1] = r[1];
            } else if (r[1]+r[3] > this.context.canvas.height) {
                direction[1] = 1;
                distance[1] = this.context.canvas.height - r[1] - r[3];
            }
            if (direction[0] || direction[1]) collisions.push([distance,direction]);
        }
        return collisions;
    }
    draw() {
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
        this.blocks.forEach(block => {
            block.rects.forEach(r=>{
                this.context.fillStyle = r[4];
                this.context.fillRect(...r);
            })
        })
    }
}
class Block {
    x = 0;
    y = 0;
    speed = [0,0];
    rects = [];
    selector = '';
    intouchable = false;
    constructor(selector, rects, intouchable) {
        this.selector = selector || '';
        this.rects = rects || [];
        if (typeof intouchable == 'boolean') this.intouchable = intouchable;
    }
    oncollide = null;
    move(x,y) {
        this.x += x;
        this.y += y;
        this.rects.forEach(r => (r[0]+=x)+(r[1]+=y));
    }
    set(x,y) {
        this.rects.forEach(r => {
            if (typeof x == 'number') r[0] += x - this.x;
            if (typeof y == 'number') r[1] += y - this.y;
        });
        if (typeof x == 'number') this.x = x; 
        if (typeof y == 'number') this.y = y;
    }
    setSpeed(x,y) {
        this.speed[0] = Math.sign(this.speed[0]) * x;
        this.speed[1] = Math.sign(this.speed[1]) * y;
    }
}