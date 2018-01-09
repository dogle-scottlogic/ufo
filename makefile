build/cb_2016_us_county_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ https://www2.census.gov/geo/tiger/GENZ2016/shp/$(notdir $@)

build/cb_2016_us_state_20m.shp: build/cb_2016_us_state_20m.zip
	unzip -od $(dir $@) $<
	touch $@

# Not currently working - use commandline instead
build/states.json: build/cb_2016_us_state_20m.shp build/ufo_sightings_by_state.csv
	topojson -o build/states.json --id-property='STATEFP,id' --external-properties=build/ufo_sightings_by_state.csv \
	--properties='name=state' \
	--properties='sightings=count' \
	--projection='width = 960, height = 600, d3.geo.albersUsa().scale(1280).translate([width / 2, height / 2])' --simplify=.5 \
	-- states=build/cb_2016_us_state_20m.shp