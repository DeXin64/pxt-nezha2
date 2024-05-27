enum MotorPostion {
    //%block="A"
    M1 = 1,
    //%block="B"
    M2 = 2,
    //%block="C"
    M3 = 3,
    //%block="D"
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

enum MotorPostionLeft {
    //%block="A"
    A = 1,
    //%block="B"
    B = 2,
    //%block="C"
    C = 3,
    //%block="D"
    Degree = 4
}
enum MotorPostionRight {
    //%block="A"
    A = 1,
    //%block="B"
    B = 2,
    //%block="C"
    C = 3,
    //%block="D"
    Degree = 4
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


const iicWaitTime = 0
//% color=#ff0011  icon="\uf06d" block="NEZHA_V2" blockId="NEZHA_V2"
namespace NEZHA_V2 {
    let i2cAddr: number = 0x10;
    let setMotorCombination = 0;
    let getMotorCombinationSpeed = 0;
    let motorspeedGlobal = 0

    let buf = pins.createBuffer(8)
    buf[0] = 0xFF;
    buf[1] = 0xF9;
    buf[2] = 0x00;
    buf[3] = 0x00;
    buf[4] = 0x00;
    buf[5] = 0x00;
    buf[6] = 0xF5;
    buf[7] = 0x00;
    pins.i2cWriteBuffer(i2cAddr, buf);

    //% group="Basic functions"
    //% block="set nehza %MotorPostion %MovementDirection %speed  %SportsMode"
    //% speed.min=0  speed.max=360
    //% inlineInputMode=inline
    //% weight=400 // 减少宽度  
    export function Motorspeed(motor: MotorPostion, direction: MovementDirection, speed: number, MotorFunction: SportsMode): void {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = direction;
        buf[4] = 0x70;
        buf[5] = (speed >> 8) & 0XFF;
        buf[6] = MotorFunction;
        buf[7] = (speed >> 0) & 0XFF;
        pins.i2cWriteBuffer(i2cAddr, buf);

    }

    //% group="Basic functions"
    //% weight=140
    //% block="nehza-motor goToAbsolutePosition %MotorPostion mode %ServoMotionMode anagle to %target_angle "
    //% target_angle.min=0  target_angle.max=360
    export function goToAbsolutePosition(motor: MotorPostion, modePostion: ServoMotionMode, target_angle: number): void {

        while (target_angle < 0) {
            target_angle += 360
        }
        target_angle %= 360
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x5D;
        buf[5] = (target_angle >> 8) & 0XFF;
        buf[6] = modePostion;
        buf[7] = (target_angle >> 0) & 0XFF;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(5);


    }

    //% group="Basic functions"
    //% weight=140
    //% block="Start the %MotorPostion %MovementDirection motor "
    //% speed.min=0  speed.max=100
    export function nezha2MotorStart(motor: MotorPostion, direction: MovementDirection): void {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = direction;
        buf[4] = 0x5E;
        buf[5] = 0x00;
        buf[6] = 0xF5;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);

    }

    //% group="Basic functions"
    //% weight=140
    //% block="Stop the %MotorPostion motor "
    //% speed.min=0  speed.max=100
    export function nezha2MotorStop(motor: MotorPostion,): void {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x5F;
        buf[5] = 0x00;
        buf[6] = 0xF5;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);

    }

    //% group="Basic functions"
    //% weight=140
    //% block="nehza-motor Crtol %MotorPostion speed %MovementDirection speed to %speed \\%"
    //% speed.min=0  speed.max=100
    export function nezha2MotorSpeedCtrol(motor: MotorPostion, direction: MovementDirection, speed: number): void {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = direction;
        buf[4] = 0x60;
        buf[5] = speed;
        buf[6] = 0xF5;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);

    }

    //% group="Basic functions"
    //% weight=320
    //%block="get %MotorPostion servo of postion (Degree)"
    export function readServoAbsolutePostion(motor: MotorPostion): number {
        let buf = pins.createBuffer(8);
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x46; // ????????  
        buf[5] = 0x00;
        buf[6] = 0xF5; // ????????  
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(4);
        let arr = pins.i2cReadBuffer(i2cAddr, 4);
        let position = (arr[3] << 24) | (arr[2] << 16) | (arr[1] << 8) | (arr[0]);
        while (position < 0) {
            position += 3600;
        }
        return (position % 3600) * 0.1;
    }

    //% group="Basic functions"
    //% weight=320
    //%block="get %MotorPostion servo of speed (RPM)"
    export function readServoAbsoluteSpeed(motor: MotorPostion): number {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;

        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x47;
        buf[5] = 0x00;
        buf[6] = 0xF5;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(3);
        let ServoSpeed1Arr = pins.i2cReadBuffer(i2cAddr, 2);
        let Servo1Speed = (ServoSpeed1Arr[1] << 8) | (ServoSpeed1Arr[0]);
        return Math.floor(Servo1Speed * 0.0926);
    }

    //% group="Basic functions"
    //% weight=320
    //%block="servo %MotorPostion Postion Reset"
    export function servoPostionReset(motor: MotorPostion): void {
        let buf = pins.createBuffer(8)
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x1D;
        buf[5] = 0x00;
        buf[6] = 0xF5;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);

    }

    // 左边轮子
    let motorLeftGlobal = 0
    //右边轮子
    let motorRightGlobal = 0
    //% group="Application functions"
    //% weight=407
    //%block="Set the running motor to %MotorPostionLeft %MotorPostionRight"
    /*
    组合积木块1：选择电机组合6种
    */
    export function RunningMotorToeSpeed(motorLeft: MotorPostionLeft, motorRight: MotorPostionRight): void {
        motorLeftGlobal = motorLeft
        motorRightGlobal = motorRight
    }
    /*

         组合积木块2：设置组合电机速度
        */
    //% group="Application functions"
    //% weight=406
    //%block="Set the running Combination Motor to %speed"
    //% speed.min=0  speed.max=100
    export function SetMotionSpeed(speed: number): void {
        // switch (motorLeft):
        //      case MotorPostionLeft.A: 
        motorspeedGlobal = speed

    }

    /*
    组合积木块3：电机功能，设置组合电机，设置方向，设置运动模式，设置运动参数
    左上角，左下角，右上角，右下角
    */
    //% group="Application functions"
    //% weight=402
    //%block="Motor Move to %HorizontalDirection %speed %SportsMode"
    //% speed.min=-100  speed.max=100

    export function CombinationMotorspeed(horizontalDirection: HorizontalDirection, speed: number, MotorFunction: SportsMode): void {
        if (speed > 0) {
            switch (horizontalDirection) {
                case HorizontalDirection.left:
                    Motorspeed(motorRightGlobal, MovementDirection.ccw, 360, SportsMode.degree)
                    basic.pause(500)
                    Motorspeed(motorLeftGlobal, MovementDirection.ccw, speed, MotorFunction)
                    Motorspeed(motorRightGlobal, MovementDirection.cw, speed, MotorFunction)
                    break
                case HorizontalDirection.right:
                    Motorspeed(motorLeftGlobal, MovementDirection.cw, 360, SportsMode.degree)
                    basic.pause(500)
                    Motorspeed(motorLeftGlobal, MovementDirection.ccw, speed, MotorFunction)
                    Motorspeed(motorRightGlobal, MovementDirection.cw, speed, MotorFunction)
                    break
            }
        }
        else {
            switch (horizontalDirection) {
                case HorizontalDirection.left:
                    Motorspeed(motorRightGlobal, MovementDirection.ccw, 360, SportsMode.degree)
                    basic.pause(500)
                    Motorspeed(motorLeftGlobal, MovementDirection.cw, -(speed), MotorFunction)
                    Motorspeed(motorRightGlobal, MovementDirection.ccw, -(speed), MotorFunction)
                    break
                case HorizontalDirection.right:
                    Motorspeed(motorLeftGlobal, MovementDirection.cw, 360, SportsMode.degree)
                    basic.pause(500)
                    Motorspeed(motorLeftGlobal, MovementDirection.cw, -(speed), MotorFunction)
                    Motorspeed(motorRightGlobal, MovementDirection.ccw, -(speed), MotorFunction)
                    break
            }
        }
    }



    /*
    组合积木块4：舵机功能，设置组合电机，设置水平方向，设置运动参数
    左上角，左下角，右上角，右下角
    */
    //% group="Application functions"
    //% weight=404
    //%block="Servo Move to %HorizontalDirection %speed"
    //% speed.min=-360  speed.max=360

    export function CombinationServoSpeed(horizontalDirection: HorizontalDirection, speed: number): void {
        //左上角，左下角，右上角，右下角,数值通过speed大小来进行判断上角(cw)和下角(ccw)
        //缺少前进的单位
        switch (horizontalDirection) {
            case HorizontalDirection.left:
                Motorspeed(motorRightGlobal, MovementDirection.ccw, 360, SportsMode.degree)
                basic.pause(500)
                nezha2MotorSpeedCtrol(motorRightGlobal, MovementDirection.cw, speed)
                nezha2MotorSpeedCtrol(motorLeftGlobal, MovementDirection.ccw, speed)
                break
            case HorizontalDirection.right:
                Motorspeed(motorLeftGlobal, MovementDirection.cw, 360, SportsMode.degree)
                basic.pause(500)
                nezha2MotorSpeedCtrol(motorRightGlobal, MovementDirection.ccw, speed)
                nezha2MotorSpeedCtrol(motorLeftGlobal, MovementDirection.cw, speed)
                break
        }
    }




    /*
    组合积木块5：停止组合电机转动
    */
    //% group="Application functions"
    //% weight=403
    //%block="Stop Combination Motor"
    export function StopCombinationMotor(): void {
        nezha2MotorStop(motorLeftGlobal)
        nezha2MotorStop(motorRightGlobal)
    }

    /*
    组合积木块6：组合电机垂直方向运动（一直运动）
    */
    //% group="Application functions"
    //% weight=405
    //%block="Combination Motor Move to %VerticallDirection"

    export function CombinationMotorVerticallDirectionMove(verticallDirection: VerticallDirection): void {
        switch (verticallDirection) {
            case VerticallDirection.up:
                nezha2MotorSpeedCtrol(motorLeftGlobal, MovementDirection.ccw, motorspeedGlobal)
                nezha2MotorSpeedCtrol(motorRightGlobal, MovementDirection.cw, motorspeedGlobal)
                break
            case VerticallDirection.dowm:
                nezha2MotorSpeedCtrol(motorLeftGlobal, MovementDirection.cw, motorspeedGlobal)
                nezha2MotorSpeedCtrol(motorRightGlobal, MovementDirection.ccw, motorspeedGlobal)
                break
        }

    }
    /*
    组合积木块7：组合舵机垂直方向运动（一直运动）
    */
    //% group="Application functions"
    //% weight=401
    //%block="Combination Motor Move to %VerticallDirection %speed %SportsMode "
    //% speed.min=0  speed.max=360
    export function CombinationServoVerticallDirectionMove(verticallDirection: VerticallDirection, speed: number, MotorFunction: SportsMode): void {
        let ServoAbsolutePostion: number
        //组合电机使用指令圈度秒
        switch (verticallDirection) {
            case VerticallDirection.up:
                Motorspeed(motorLeftGlobal, MovementDirection.cw, speed, MotorFunction)
                Motorspeed(motorRightGlobal, MovementDirection.ccw, speed, MotorFunction)
                break
            case VerticallDirection.dowm:
                Motorspeed(motorLeftGlobal, MovementDirection.ccw, speed, MotorFunction)
                Motorspeed(motorRightGlobal, MovementDirection.cw, speed, MotorFunction)
                break
        }





    }
    // let distanceroundCm
    // let distanceroundIrch
    /*
    组合积木块8：将电机旋转一圈设置为（N）（厘米）
    */
    //% group="Application functions"
    //% weight=320
    //%block="Set the motor to rotate one revolution to %far %Unit"
    // export function SetMotorOneRotateRevolution(far: number, unit: Unit): void {
    //     let ServoAbsolutePostion: number

    // }


    //% group="export functions"
    //% weight=320
    //%block="get %MotorPostion servo of postion"
    export function readVersion(): string {
        let buf = pins.createBuffer(8);
        buf[0] = 0xFF;
        buf[1] = 0xF9;
        buf[2] = 0x00;
        buf[3] = 0x00;
        buf[4] = 0x88;
        buf[5] = 0x00;
        buf[6] = 0x00;
        buf[7] = 0x00;
        pins.i2cWriteBuffer(i2cAddr, buf);
        // 读取版本号
        let version = pins.i2cReadBuffer(i2cAddr, 3);
        return `V ${version[0]}.${version[1]}.${version[2]}`;
    }
}