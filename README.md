![](https://img.shields.io/badge/Plantfrom-Micro%3Abit-red) ![](https://img.shields.io/travis/com/elecfreaks/pxt-nezha) ![](https://img.shields.io/github/v/release/elecfreaks/pxt-nezha) ![](https://img.shields.io/github/last-commit/elecfreaks/pxt-nezha) ![](https://img.shields.io/github/languages/top/elecfreaks/pxt-nezha) ![](https://img.shields.io/github/issues/elecfreaks/pxt-nezha) ![](https://img.shields.io/github/license/elecfreaks/pxt-nezha) 

# NeZha Package

![](/nezha.png/)

This extension is designed to programme and drive the NeZha micro:bit expansion board, You can [get NeZhaV2 from the Elecfreaks store](https://shop.elecfreaks.com/products/nezha-breakout-board-v2)

## Code Example
```JavaScript

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    NEZHA_V2.servoPostionReset(MotorPostion.M1)
})
input.onButtonPressed(Button.A, function () {
    NEZHA_V2.nezha2MotorStart(MotorPostion.M1, MovementDirection.cw)
    NEZHA_V2.nezha2MotorStart(MotorPostion.M2, MovementDirection.cw)
    NEZHA_V2.nezha2MotorStart(MotorPostion.M3, MovementDirection.cw)
    NEZHA_V2.nezha2MotorStart(MotorPostion.M4, MovementDirection.cw)
})
input.onButtonPressed(Button.B, function () {
    NEZHA_V2.goToAbsolutePosition(MotorPostion.M1, ServoMotionMode.cw, 0)
    NEZHA_V2.goToAbsolutePosition(MotorPostion.M2, ServoMotionMode.cw, 0)
})


```
## Supported targets

* for PXT/microbit

## License
MIT

