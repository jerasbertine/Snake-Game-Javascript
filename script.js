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
    var widthinBlocks = canvasWidth / block_size;
    var heightinBlocks = canvasHeight / block_size;
    var score;

    init();

    function init() {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "25px solid gray";
        canvas.style.margin = "100px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snake = new Snake([[6,4], [5,4], [4,4]], "right");
        appeule = new Apple([10, 10]);
        score = 0;
        refresh_canvas();
    }

    function refresh_canvas() {
        snake.advance();
        if(snake.checkCol()) {
            gameover();
        } else {
            if(snake.iseatapple(appeule)) {
                score++;
                snake.ate_apple = true;
                do {
                    appeule.set_new_pos();
                } while(appeule.is_on_snake(snake))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            draw_score();   
            snake.draw();
            appeule.draw();
            setTimeout(refresh_canvas, delay);
        }
    }

    function gameover() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Press space to play again", centreX, centreY - 120);
        ctx.fillText("Press space to play again", centreX, centreY - 120);
        ctx.restore();
    }

    function restart() {
        snake = new Snake([[6,4], [5,4], [4,4]], "right");
        appeule = new Apple([10, 10]);
        score = 0;
        refresh_canvas();
    }

    function draw_score() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, pos) {
        var x = pos[0] * block_size;
        var y = pos[1] * block_size;
        ctx.fillRect(x, y, block_size, block_size);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ate_apple = false;
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
            if(!this.ate_apple)
                this.body.pop();
            else
                this.ate_apple = false;
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

        this.checkCol = function() {
            var wallCol = false;
            var snakeCol = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthinBlocks - 1;
            var maxY = heightinBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCol = true;

            for(var i = 0; i < rest.length; i++) {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCol = true;
            }
            return wallCol || snakeCol;
        };

        this.iseatapple = function(appletoeat) {
            var head = this.body[0];
            if (head[0] === appletoeat.pos[0] && head[1] === appletoeat.pos[1])
                return true;
            else
                return false;
        };
    }

    function Apple(pos) {
        this.pos = pos;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = block_size/2;
            var x = this.pos[0] * block_size + radius;
            var y = this.pos[1] * block_size + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };

        this.set_new_pos = function() {
            var newX = Math.round(Math.random() * (widthinBlocks - 1));
            var newY = Math.round(Math.random() * (heightinBlocks - 1));
            this.pos = [newX, newY];
        }

        this.is_on_snake = function(check_snake) {
            var is_on_snake = false;

            for(var i = 0; i < check_snake.body.length; i++) {
                if (this.pos[0] === check_snake.body[i][0] && this.pos[1] === check_snake.body[i][1])
                    is_on_snake = true;
            }
            return is_on_snake;
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
            case 32:
                restart();
                return;
            default:
                return;
        }
        snake.setDirection(new_direction);
    }

}