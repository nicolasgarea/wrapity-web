generate-models:
	rm -rf src/app/core/models/*
	npx @openapitools/openapi-generator-cli generate -i http://localhost:8000/openapi.json -g typescript-angular -o src/app/core/models --global-property models --additional-properties=modelPropertyNaming=original,modelFileNaming=original,supportsES6=true