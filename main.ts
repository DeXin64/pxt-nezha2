enum MotorPostion {
    //%block="M1"
    M1 = 1,
    //%block="M2"
    M2 = 2,
    //%block="M3"
    M3 = 3,
    //%block="M4"
    M4 = 4
}

enum MovementDirection {
    //%block="cw"
    cw = 1,
    //%block="ccw"
    ccw = 2
}

enum SportsMode {
    //%block="circle"
    circle = 1,
    //%block="degree"
    degree = 2,
    //%block="second"
    second = 3
}


enum ServoMotionMode {
    //%block="Shortest path"
    ShortestPath = 1,
    //%block="cw"
    cw = 2,
    //%block="ccw"
    ccw = 3
}


enum MotorCombination {
    //%block="A+B"
    ab = 1,
    //%block="A+C"
    ac = 2,
    //%block="A+D"
    ad = 3,
    //%block="B+C"
    bc = 4,
    //%block="B+D"
    bd = 5,
    //%block="C+D"
    cd = 6
}

enum HorizontalDirection {
    //%block="left"
    left = 1,
    //%block="right"
    right = 2
}

enum VerticallDirection {
    //%block="up"
    up = 1,
    //%block="dowm"
    dowm = 2
}

enum Unit {
    //%block="cm"
    cm = 1,
    //%block="irch"
    irch = 2
}
//% weight=100 color=#008C8C block="NEHZAV2" blockId="NEHZAV2" icon="\uf48b"
namespace NEHZAV2 {
    let i2cAddr: number = 0x10;

    //% group="Basic functions"
    //% block="set nehza %MotorPostion %MovementDirection %speed  %SportsMode"
    //% speed.min=0  speed.max=360
    //% weight=400 // 减少宽度  
    export function Motorspeed(motor: MotorPostion, direction: MovementDirection, speed: number, MotorFunction: SportsMode): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = direction;
        buf[3] = 0x70;
        buf[4] = (speed >> 8) & 0XFF;
        buf[5] = MotorFunction;
        buf[6] = (speed >> 0) & 0XFF;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(4)
    }

    //% group="Basic functions"
    //% weight=140
    //% block="nehza-motor goToAbsolutePosition %MotorPostion mode %ServoMotionMode anagle to %speed "
    //% speed.min=0  speed.max=360
    export function goToAbsolutePosition(motor: MotorPostion, modePostion: ServoMotionMode, speed: number): void {
        let current_angle, target_angle, angle_diff;
        target_angle = speed
        current_angle = readServoAbsolutePostion(motor)//是要获取的
        switch (modePostion) {
            case 1:
                let buf = pins.createBuffer(7)
                buf[0] = 0xFF;
                buf[1] = motor;//���λ��
                buf[2] = modePostion;//
                buf[3] = 0x66;
                buf[4] = (speed >> 8) & 0XFF;
                buf[5] = 0xF5;
                buf[6] = (speed >> 0) & 0XFF;
                pins.i2cWriteBuffer(i2cAddr, buf);
                basic.pause(4)
                break;
            case 2:
                //正转
                angle_diff = (target_angle - current_angle + 360) % 360
                NEHZAV2.Motorspeed(motor, MovementDirection.cw, angle_diff, SportsMode.degree)
                break;
            case 3:
                //反转
                angle_diff = (current_angle - target_angle + 360) % 360
                NEHZAV2.Motorspeed(motor, MovementDirection.ccw, angle_diff, SportsMode.degree)
                break;
        }


    }

    //% group="Basic functions"
    //% weight=140
    //% block="Start the %MotorPostion %MovementDirection motor "
    //% speed.min=0  speed.max=100
    export function nezha2MotorStart(motor: MotorPostion, direction: MovementDirection): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = direction;
        buf[3] = 0x5E;
        buf[4] = 0x00;
        buf[5] = 0xF5;
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(4)
    }

    //% group="Basic functions"
    //% weight=140
    //% block="Stop the %MotorPostion motor "
    //% speed.min=0  speed.max=100
    export function nezha2MotorStop(motor: MotorPostion,): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = 0x00;
        buf[3] = 0x5F;
        buf[4] = 0x00;
        buf[5] = 0xF5;
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(4)
    }

    //% group="Basic functions"
    //% weight=140
    //% block="nehza-motor Crtol %MotorPostion speed %MovementDirection speed to %speed "
    //% speed.min=0  speed.max=100
    export function nezha2MotorSpeedCtrol(motor: MotorPostion, direction: MovementDirection, speed: number): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = direction;
        buf[3] = 0x60;
        buf[4] = speed;
        buf[5] = 0xF5;
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(4)
    }

    //% group="Basic functions"
    //% weight=320
    //%block="get %MotorPostion servo of postion"
    export function readServoAbsolutePostion(motor: MotorPostion): number {
        let ServoSpeedArr = pins.createBuffer(4);
        let buf = pins.createBuffer(7);
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = 0x00;
        buf[3] = 0x46; // ????????  
        buf[4] = 0x00;
        buf[5] = 0xF5; // ????????  
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(50); // ????  

        // ??4?????  
        ServoSpeedArr[0] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        ServoSpeedArr[1] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        ServoSpeedArr[2] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        ServoSpeedArr[3] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        basic.pause(10); // ???????????????  


        let ServoSpeed = (ServoSpeedArr[3] << 24) | (ServoSpeedArr[2] << 16) | (ServoSpeedArr[1] << 8) | (ServoSpeedArr[0]);
        if ((ServoSpeed << 31) != 1) {
            ServoSpeed = ((ServoSpeed & 0x0fffff) / 10) % 360
        }
        else {
            ServoSpeed = ((0x0fffff - (ServoSpeed & 0x0fffff)) / 10) % 360
        }

        return ServoSpeed;
    }

    //% group="Basic functions"
    //% weight=320
    //%block="get %MotorPostion servo of speed"
    export function readServoAbsoluteSpeed(motor: MotorPostion): number {
        let ServoAbsolutePostion: number
        let ServoSpeed1Arr = pins.createBuffer(2);
        let buf = pins.createBuffer(7)
        buf[0] = 0xFF;
        buf[1] = motor;
        buf[2] = 0x00;
        buf[3] = 0x47;
        buf[4] = 0x00;
        buf[5] = 0xF5;
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(50);
        ServoSpeed1Arr[0] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        ServoSpeed1Arr[1] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        let Servo1Speed = (ServoSpeed1Arr[1] << 8) | (ServoSpeed1Arr[0]);
        Servo1Speed = Servo1Speed / 10
        basic.pause(10);
        return Servo1Speed;
    }


    //% group="Application functions"
    //% weight=320
    //%block="Set the running motor to %MotorCombination"
    /*
    组合积木块1：选择电机组合6种
    */

    export function RunningMotorToeSpeed(motor: MotorCombination): void {
        let ServoAbsolutePostion: number

    }

    /*
     组合积木块2：设置组合电机速度
 */
    //% group="Application functions"
    //% weight=320
    //%block="Set the running Combination Motor to %speed"
    //% speed.min=0  speed.max=100

    export function SetMotionSpeed(speed: number): void {
        let ServoAbsolutePostion: number

    }

    /*
    组合积木块3：电机功能，设置组合电机，设置方向，设置运动模式，设置运动参数
左上角，左下角，右上角，右下角
*/
    //% group="Application functions"
    //% weight=320
    //%block="Motor Move to %HorizontalDirection %speed %SportsMode"
    //% speed.min=0  speed.max=360

    export function CombinationMotorspeed(horizontalDirection: HorizontalDirection, speed: number, MotorFunction: SportsMode): void {
        let ServoAbsolutePostion: number

    }

    /*
    组合积木块4：舵机功能，设置组合电机，设置水平方向，设置运动参数
左上角，左下角，右上角，右下角
*/
    //% group="Application functions"
    //% weight=320
    //%block="Servo Move to %HorizontalDirection %speed"
    //% speed.min=0  speed.max=360

    export function CombinationServoSpeed(horizontalDirection: HorizontalDirection, speed: number): void {
        let ServoAbsolutePostion: number

    }

    /*
    组合积木块5：停止组合电机转动
*/
    //% group="Application functions"
    //% weight=320
    //%block="Stop Combination Motor"
    export function StopCombinationMotor(): void {
        let ServoAbsolutePostion: number

    }

    /*
    组合积木块6：组合电机垂直方向运动（一直运动）
*/
    //% group="Application functions"
    //% weight=320
    //%block="Combination Motor Move to %VerticallDirection"

    export function CombinationMotorVerticallDirectionMove(verticallDirection: VerticallDirection): void {
        let ServoAbsolutePostion: number

    }
    /*
    组合积木块7：组合舵机垂直方向运动（一直运动）
*/
    //% group="Application functions"
    //% weight=320
    //%block="Combination Motor Move to %VerticallDirection %speed %SportsMode "
    //% speed.min=0  speed.max=360
    export function CombinationServoVerticallDirectionMove(verticallDirection: VerticallDirection, speed: number, MotorFunction: SportsMode): void {
        let ServoAbsolutePostion: number

    }

    /*
    组合积木块8：将电机旋转一圈设置为（N）（厘米）
*/
    //% group="Application functions"
    //% weight=320
    //%block="Set the motor to rotate one revolution to %far %Unit"
    export function SetMotorOneRotateRevolution(far: number, unit: Unit): void {
        let ServoAbsolutePostion: number

    }

    //% group="test functions"
    //% weight=140
    //% block="tset %speed "
    //% speed.min=0  speed.max=360
    export function test(speed: number): void {
        let buf = pins.createBuffer(6)
        buf[0] = 0xFF;
        buf[1] = 0x01;//���λ��
        buf[2] = 0x00;//(speed >> 8) & 0xff;/
        buf[3] = 0X99;//TEST MODE
        buf[4] = (speed >> 8) & 0xff;//���λ��        
        buf[5] = (speed >> 0) & 0xff;//���λ��
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    //% group="export functions"
    //% weight=320
    //%block="get %MotorPostion servo of postion"
    export function readVersion(): string {
        let versionH, versionZ, versionL;
        let buf = pins.createBuffer(7);
        buf[0] = 0xFF;
        buf[1] = 0x00;
        buf[2] = 0x00;
        buf[3] = 0x88; // ????????  
        buf[4] = 0x00;
        buf[5] = 0x00; // ????????  
        buf[6] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(50); // ????  

        // ??4?????  
        versionH = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);
        basic.pause(10); // ???????????????  

        return ("V" + convertToText(1) + "." + convertToText(0) + "." + convertToText(versionH))
    }
}