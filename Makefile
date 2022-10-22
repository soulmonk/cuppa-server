build:
	@echo Build sourcecode
	npx nx run ${name}:build --configuration=production
	@echo Start building $(name):v$(version)
	docker build -t cuppa/${name}:v${version} --platform linux/arm64 -f ./tools/deployment/$(name)/Dockerfile .
	docker tag cuppa/${name}:v${version} rpisoulv1.kube:31320/cuppa/${name}:v${version}
	docker push rpisoulv1.kube:31320/cuppa/${name}:v${version}
	@echo "docker pushed"
	@echo "updating deployment, TODO"
	@echo "for now please update manually version and run command: tools/kubernetes/${name}/deployment.yaml"
	@echo "kubectl --kubeconfig  ~/.kube/config.cuppa-cluster-1 apply -f tools/kubernetes/${name}/deployment.yaml"

apply-kube:
	kubectl --kubeconfig  ~/.kube/config.cuppa-cluster-1 apply -f tools/kubernetes/${name}/deployment.yaml

build-local:
	@-$(MAKE) build-app build-docker-local

build-app:
	npm run build ${name}

build-docker-local:
	docker build -t cuppa-${name} -f ./tools/deployment/$(name)/Dockerfile .

run-docker-local:
	docker run -d --name cuppa-${name} -p ${port}:${port} -e PORT=${port} cuppa-${name}
