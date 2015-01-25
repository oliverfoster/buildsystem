
base {

	< ! base:addTaskToReadyQueue( callback(Waiter.Task) );

	> ~ data:ready(base)
	> ~ router:ready()
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
	> ! document:ended()

	> ! behaviour:initialized(view);
	> ! behaviour:preRendered(view);
	> ! behaviour:rendered(view);
	> ! behaviour:postRendered(view);
	> ! behaviour:removed(view);
	
}


Default behaviour {
	> ! initialized()
	> ! preRendered()
	> ! rendered()
	> ! postRendered()
	> ! removed()
}
