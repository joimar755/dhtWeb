import { ledStatus } from "../server.js";

export const get_leds = (req, res,) => {
    res.json(ledStatus);
}

export const post_leds = (req, res) => {
    const { led1, led2, led3 } = req.body;
    ledStatus.led1 = led1;
    ledStatus.led2 = led2;
    ledStatus.led3 = led3;
    //io.emit("control", ledStatus);
    console.log("Nuevo estado:", { ledStatus });
    return res.json({ success: true, status: ledStatus });
}