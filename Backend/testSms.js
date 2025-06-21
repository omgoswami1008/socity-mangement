const sendSMS = (phone, message) => {
    return axios.post("https://www.fast2sms.com/dev/bulkV2", {
        route: "q",  // ✅ Use 'q' for transactional SMS
        sender_id: "TXTIND",
        message: message,
        language: "english",
        flash: 0,
        numbers: phone
    }, {
        headers: {
            "authorization": "kExYgsny5e1Uva8HdWlu03pIbXO2V9iPKQFBrzNDmMJG4cSL7Z9RtDXM7jEC0V2y8JYgQswcamOHWbFS"  // Replace with your Fast2SMS API key
        }
    }).then(response => {
        console.log("SMS sent:", response.data);
    }).catch(error => {
        console.error("SMS sending failed:", error.response?.data || error.message);
    });

};

const sendSMS = require("./sendSMS");

sendSMS("9427734998", "Test message from server");
