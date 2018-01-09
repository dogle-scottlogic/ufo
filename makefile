build/cb_2016_us_county_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ https://www2.census.gov/geo/tiger/GENZ2016/shp/$(notdir $@)

build/cb_2016_us_county_20m.shp: build/cb_2016_us_county_20m.zip
	unzip -od $(dir $@) $<
	touch $@

# Not currently working - use commandline instead
build/counties.json: build/cb_2016_us_county_20m.shp
	topojson \
		-o $@ \
		--projection='width = 960, height = 600, d3.geo.albersUsa() \
			.scale(1280) \
			.translate([width / 2, height / 2])' \
		--simplify=.5 \
		-- counties=$<