//获取TODO的任务计数和done的任务计数节点
	var todosIndex = document.getElementById("todo").getElementsByTagName("span")[1];
	var donesIndex = document.getElementById("done").getElementsByTagName("span")[1];
//获取todo和dones的节点
	var todos = document.getElementById("todo");
	var dones = document.getElementById("done");

//创建一个TaskManager对象
function TaskManager(){
	this.todos =[];
	this.dones = [];
}

//切换状态改变任务的位置，在TODO位置还是在done位置
TaskManager.prototype.refreshItem = function(input,checked){
	if (checked) {	//在未完成时的位置
		var index = this.todos.indexOf(input);
		this.todos.splice(index,1);
		this.dones.push(input);
		console.log(index);
	}else{	//在未完成时的位置
		var index = this.dones.indexOf(input);
		this.dones.splice(index,1);
		this.todos.push(input);
		console.log(index);
	}
}

//拖拽任务
TaskManager.prototype.dragAndDrop = function(li,status){
	if(status == false){	//判断拖拽任务状态为TODO
		var indexTodo = this.todos.indexOf(li);	//查找该任务在todos里的位置
		li.firstChild.checked = true; //改变状态为dones
		this.todos.splice(indexTodo,1);	//在TODOs任务里删除该任务
		this.dones.push(li);	//将任务添加到dones里
	}
	if(status == true){	//判断拖拽任务状态为don
		var indexDones = this.dones.indexOf(li);	//查找该任务在dones里的位置
		li.firstChild.checked = false;	//改变状态为dones
		this.dones.splice(indexDones,1);	//在dons任务里删除该任务
		this.todos.push(li);	//将任务添加到dones里
	}
}
//计算TODO任务数，和done任务数
TaskManager.prototype.index = function(todosIndex,donesIndex){
	todosIndex.innerHTML = this.todos.length;
	donesIndex.innerHTML = this.dones.length;
}

//添加任务到TODO里面去
TaskManager.prototype.pushItem = function(li){
	this.todos.push(li);
}

//删除任务
TaskManager.prototype.removeNode= function(a,status){
	if (status) { //删除done任务
		var index = this.dones.indexOf(a);
		this.dones.splice(index,1);
		console.log(index);
	}else{	//删除TODO任务
		var index = this.todos.indexOf(a);
		this.todos.splice(index,1);
		console.log(index);
	}
}
//清空节点
clearNode = function(todos,dones){
	while (todos.childNodes.length > 4) {
		todos.removeChild(todos.lastChild);
	}
 	while(dones.childNodes.length > 4){
 		dones.removeChild(dones.lastChild);
 	}
}

//添加任务到HTML中
TaskManager.prototype.addNode = function(todos,dones){
	for(var i = 0; i < this.todos.length; i++){
		todos.appendChild(this.todos[i]);
	}
	for(var i = 0;i < this.dones.length; i++){
		dones.appendChild(this.dones[i]);
	}
}

//单例模式
TaskManager.getInstance = (function(){
	var instance;
	return function(){
		if(!instance){
			instance = new TaskManager();
		}
		return instance;
	}
})();

var TM = TaskManager.getInstance();

//实例个task，用来执行任务的改变，添加
function Task(text){
	//创建input，a，span标签并且把他们添加到创建的li标签立马 
	var li = document.createElement("li");
	li.className = "task";
	li.id = new Date();
	li.draggable = "true";
	li.ondragstart = function(e){	//被拖拽时
		e.dataTransfer.setData("Text",e.target.id);	//拖拽时保存被拖拽元素的id
	}

	//动态添加input标签
	var input = document.createElement("input");
	input.type = "checkbox";
	input.checked = false;
	input.onclick = function(){	//改变任务的状态
		TM.refreshItem(this.parentNode,this.checked);	//切换任务状态时的todos变化和dones的变化
		TM.index(todosIndex,donesIndex);	//计数TODO的任务数和done的任务数；
		TM.addNode(todos,dones);	//添加节点
	}	
	li.appendChild(input);	//将input标签添加到li标签里

	//动态添加span标签
	var span = document.createElement("span");
	span.innerHTML = text;	//将span标签的文本设置成传过来的参数
	li.appendChild(span);

	//动态生成a标签
	var a = document.createElement("a");
	a.innerHTML = "-";	//将a标签的文本设置成 -
	li.appendChild(a);
	a.onclick = function (){	//删除li标签
		this.status = this.parentNode.firstChild.checked;	//任务的状态
		TM.removeNode(this.parentNode,this.status);	//删除a标签的上级元素里标签以及li元素的子元素
		clearNode(todos,dones);	//清空节点
		TM.index(todosIndex,donesIndex);	//计数TODO的任务数和done的任务数；
		TM.addNode(todos,dones);	//添加节点
	}	

	TM.pushItem(li);	//添加任务到todo里
	TM.index(todosIndex,donesIndex);	//计数TODO的任务数和done的任务数；
	TM.addNode(todos,dones);	//添加节点
}

//添加任务
document.getElementById("text").onkeydown = function(e){
	if(e.keyCode == 13 && this.value != ""){	//点击了enter
		this.innerHTML = "";
		Task(this.value);
		console.log('输入事件名称' + this.value);
		this.value = "";
	}
}

//取消拖拽的默认设置
function allowDrop(ev)
{
	ev.preventDefault();
}

function drop(ev)
{
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");	//获取到拖拽时保存的文档
	var li = document.getElementById(data);	//查找到拖拽元素的节点
	var status = li.firstChild.checked;	//获取拖拽元素的状态
	TM.dragAndDrop(li,status);	//拖拽时改变的tm的数组
	clearNode(todos,dones);	//清空节点
	TM.index(todosIndex,donesIndex);	//计数TODO的任务数和done的任务数；
	TM.addNode(todos,dones);	//添加节点
}