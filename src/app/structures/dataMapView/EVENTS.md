dataMapView {
	
	> ! router:preRoute:app:id(mapID);
	> ! router:route:app:id(mapID);	
	> ! router:postRouter:app:id(mapID);

	> ! document:title(title)
	< ! document:add(map)
	> ! document:adding(view)
	> ! document:added(view)
	< ! document:remove(view)
	> ! document:removed(view);

	> ! behaviour:dropzonesPreRender(view)
	> ! behaviour:dropzonesPostRender(view)

}

DataMapView behaviour {
	> ! dropzonesPreRender
	> ! dropzonesPostRender
}