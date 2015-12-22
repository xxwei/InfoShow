var http = require('http');
var cluster = require('cluster');
var koa = require('koa');
if(cluster.isMaster){//主进程
	var numCPU = require('os').cpus().length;
	console.log('system have '+numCPU+ ' CPU');
	for (var i = 0; i < numCPU; i++) { 
        var worker = cluster.fork(); 
    }  
}else{
	var app = koa();
	//x-response-time
	app.use(function *(next){
		var start = new Date;
		yield next;
		var ms = new Date -start;
		this.set('x-response-time',ms+'ms');
		console.log('x-response-time %s %s %s ms',this.method,this.url,ms);
	});

	// logger 
	app.use(function *(next){
		var start = new Date;
		yield next;
		var ms = new Date - start;
		console.log(' logger  %s %s %s ms',this.method,this.url,ms);
	});

	// response 
	app.use(function *(){
		//this; is the Context;
		//this.request: is a koa Request
		//this.response is a koa Resposne
		this.body = 'hello world';
		//console.log(this.request);
		console.log(this.request.path);
		console.log('work id '+cluster.worker.id+' have a request ');
		//console.log(this.ip);
	});
	app.listen(4000);

}