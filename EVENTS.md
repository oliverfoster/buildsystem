
base {
	~ base:dataLoaded(base.config, base.data)
	! base:dataProcessorAdd(Waiter);
	~ base:ready();
	
	~ router:started(base.router)
	~ router:route(arguments)
	~ router:routed(arguments)

	~ document:started()
	! document:clear()
	~ document:cleared()
	! document:new()
	! document:add(view)
	~ document:added(view)
	~ document:ready()
	! document:removeAll()
	~ document:removedAll()
	! document:remove(view)
	~ document:removed(view)
	! document:ended()

	~ view:registered(type, name, view)
}


view {
	! ready(view)
	! remove
	! model.change
}