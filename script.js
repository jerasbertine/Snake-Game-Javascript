window.onload = function()
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var block_size = 30;
    var delay = 100;
    var canvas;
    var ctx;
    var snake;
    var appeule;

    init();

    function init() {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snake = new Snake([[6,4], [5,4], [4,4]], "right");
        appeule = new Apple([10, 10])
        refresh_canvas();
    }

    function refresh_canvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snake.advance();
        snake.draw();
        appeule.draw();
        // setTimeout(refresh_canvas, delay);
    }

    function drawBlock(ctx, pos) {
        var x = pos[0] * block_size;
        var y = pos[1] * block_size;
        ctx.fillRect(x, y, block_size, block_size);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function() {
            var next_pos = this.body[0].slice();
            switch(this.direction) {
                case "left":
                    next_pos[0]--;
                    break;

                case "right":
                    next_pos[0]++;
                    break;

                case "down":
                    next_pos[1]++;
                    break;

                case "up":
                    next_pos[1]--;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(next_pos);
            this.body.pop();
        };
        this.setDirection = function(new_direction) {
            var allowedDirection;
            switch(this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;

                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(new_direction) > -1) {
                this.direction = new_direction;
            }
        };
    }

    function Apple(pos) {
        this.pos = pos;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = block_size/2;
            var x = pos[0] * block_size + radius;
            var y = pos[1] * block_size + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
    }

    document.onkeydown = function handlekeypressed(e) {
        var key = e.keyCode;
        var new_direction;

        switch(key) {
            case 37:
                new_direction = "left";
                break;
            case 38:
                new_direction = "up";
                break;
            case 39:
                new_direction = "right";
                break;
            case 40:
                new_direction = "down";
                break;
            default:
                return;
        }
        snake.setDirection(new_direction);
    }

}