pageMenuComponent {
	
	> ! router:router:app:id(mapID);	

	< ! document:add(map)
	> ! document:added(view)
	< ! document:remove(view)
	> ! document:removed(view);

}