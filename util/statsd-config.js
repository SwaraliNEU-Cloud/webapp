module.exports = {
    port: 8125,
    backends: ["./backends/console", "statsd-cloudwatch-backend"],
    cloudwatch: {
        namespace: "MY_CUSTOM_SPACE",
        region: "us-east-1",
    }
}