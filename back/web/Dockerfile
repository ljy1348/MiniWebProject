# 사용할 Java의 베이스 이미지를 지정합니다.
FROM openjdk:11

# 컨테이너 내에서 애플리케이션을 실행할 디렉토리를 생성합니다.
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너 내부로 복사합니다.
COPY ./build/libs/web-0.0.1-SNAPSHOT.war /app

# 컨테이너가 시작될 때 실행될 명령을 지정합니다.
CMD ["java", "-jar", "/app/web-0.0.1-SNAPSHOT.war"]