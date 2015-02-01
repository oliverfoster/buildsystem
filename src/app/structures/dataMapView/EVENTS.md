dataMapView {
	
	> ! router:routing:app:id(mapID);
	> ! router:route:app:id(mapID);	
	> ! router:routed:app:id(mapID);

	> ! document:title(title)
	< ! document:add(map)
	> ! document:adding(view)
	> ! document:added(view)
	< ! document:remove(view)
	> ! document:removed(view);

	> ! behaviour:dropzones:rendering(view)
	> ! behaviour:dropzones:rendered(view)

	> ! data:processed();

}

DataMapView behaviour {
	> ! dropzones:rendering
	> ! dropzones:rendered
}