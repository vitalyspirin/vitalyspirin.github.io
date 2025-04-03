
## Backend

To run backend script first you need to login into Docker container with mounting this project folder. 
So on Windows:

`
docker run -it --rm -v "%cd%":/home vitalyspirin/alpine-reactjs
`

Then (and you are already inside docker container) execute:

```
cd /home/backend

node --experimental-modules ./createAudioFiles.mjs
```

## Useful commands for development

Delete all Docker images, containers etc:

`
docker system prune -a -f
`
