FROM node:20.12.2-alpine
RUN mkdir -p /opt/app/backend
RUN mkdir -p /opt/app/frontend
WORKDIR /opt/app
COPY backend/package*.json /opt/app/backend/
COPY frontend/package*.json /opt/app/frontend/
RUN cd /opt/app/frontend && npm i
RUN cd /opt/app/backend && npm i && npm i -g pm2
COPY backend/. /opt/app/backend/
COPY frontend/. /opt/app/frontend/
RUN cd /opt/app/frontend && npm run build
RUN rm -rf /opt/app/frontend
WORKDIR /opt/app/backend
EXPOSE 3000
CMD [ "npm", "start" ]