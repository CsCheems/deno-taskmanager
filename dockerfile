FROM denoland/deno:1.41.0

WORKDIR /app

COPY deno.json .
COPY main.ts .

RUN deno cache main.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]
