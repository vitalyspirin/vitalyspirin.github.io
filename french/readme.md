
## Backend

To run backend script first you need to login into Docker container with mounting this project folder. 
So on Windows:

`
docker run -it --rm -v "%cd%":/home vitalyspirin/alpine-reactjs:2.0
`

Then (and you are already inside docker container) execute:

```
cd /home/backend

node ./createAudioFiles.mjs
```

## Useful commands for development

Delete all Docker images, containers etc:

`
docker system prune -a -f
`
