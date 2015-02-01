
base {

	< ! base:addTaskToReadyQueue( callback(Waiter.Task) );

	> ~ data:ready(base)
	> ~ router:started()
	> ~ registry:ready()
	> ~ behaviour:ready()
	> ~ document:started()

	> ~ base:ready();
	
	> ~ router:start()
	> ~ router:route:[type](arguments)
	> ~ router:routed:[type](arguments)

	< ! document:new()
	< ! document:clear()
	> ~ document:cleared()
	> ! document:finished()

	> ! behaviour:initialized(view);
	> ! behaviour:rendering(view);
	> ! behaviour:render(view);
	> ! behaviour:rendered(view);
	> ! behaviour:removed(view);
	
}


Default behaviour {
	> ! initialized()
	> ! rendering()
	> ! render()
	> ! rendered()
	> ! removed()
}
