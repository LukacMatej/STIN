FROM python:bookworm

RUN apt update && apt install -y \
    python3-pip \
    curl

COPY requirements.txt /
RUN pip3 install -r requirements.txt 
RUN pip install pytest pytest-cov

WORKDIR /
ADD app/ /app
ADD server.py /

EXPOSE 8000

CMD python3 server.py --debug