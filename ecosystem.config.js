module.exports = {
	apps : [{
		name   : "pratilipi-asm",
		script : "src/server.js",
		exec_mode: "cluster",
		kill_timeout: 30000,
		wait_ready: true,
		merge_logs: true,
		instances: -1,
		log_date_format: "YYYY-MM-DD HH:mm Z"
	}]
}
