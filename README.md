# MiniWebProject
# 개요
학원 수업 중 배운것들 정리 겸 개인적으로 공부한 것들 적용을 위한 개인 프로젝트입니다.  
목적은 기본적인 게시판 기능 클론, 그 외 기능 구현 및 기술 스택 연습에 목적을 둡니다.  
학원 수업을 들으면서 따로 하는거라 하루에 많은 시간을 투자할 수 없습니다.  
만약 잘 만들어 진다면 취업용 이력서에 포함할 예정입니다.  

[1. 기술 스택](#%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)  
[2. 업데이트 내역](#업데이트-내역)  
[3. 구현된 기능](#구현된-기능)  
[4. 구현할 기능](#구현할-기능)  
[5. 라이선스](#라이선스)  
[6. todo](#todo)  
[7. 고민](#고민)  
[8. 작업 히스토리](#작업-히스토리)  

# 기술 스택
Front-end: react, typeScript  
Back-end: Spring Boot 2.7.6  
인증/인가: JWT Token, Spring Security  
컨테이너화: Docker                                  
배포: AWS ec2, GitHub Actions을 이용한 ci/cd 자동배포    
데이터베이스: aws mySql                          
ORM : jpa  
외부 라이브러리 : Ck Editor, Material UI  
파일 저장 : db -> aws S3    

# 업데이트 내역
0.0.2
기본적인 게시판 기능(crud, 댓글) 구현 완료

0.0.1.3
게시판 crud 구현 완료.

0.0.1.2
게시글 쓰기, 게시글 조회 구현.  

0.0.1.0
시큐리티 설정 완료.  
로그인/회원가입 구현 완료.  

# 구현된 기능
Spring Security를 사용한 jwt 토큰 인증/인가  
게시판 crud  
인증된 사용자만 게시글 쓰기 가능  
본인이 쓴 게시글만 수정/삭제 가능

# 구현할 기능
## 공통 기능
도커 연습을 위한 백/프론트 컨테이너로 각각 구동하여 도커 네트워크로 통신  
aws에 github를 통해 자동 배포  

## 비회원 기능
첨부파일 다운로드  

## 게시글 기능
단건 파일 업로드, 다운로드  
여러건 파일 업로드, 다운로드  
파일 s3에 업로드  
사진 업로드 시 썸네일 만들어 저장  
댓글 및 대댓글   
작성자, 제목, 내용 검색 기능  

## 유저 기능
유저 정보 수정  
회원 탈퇴  
댓글 알림  
관리자한테 채팅 요청  

## 관리자 기능
관리자 페이지 - 유저 권한 설정, 강제 회원 탈퇴  
채팅 요청한 회원과 채팅  

# 라이선스
CKEditor 5: GPL-2, Commercial License (https://github.com/ckeditor/ckeditor5)  

# todo
다음주부터 수업에서 개인 프로젝트 시작 및 프로젝트용 탬플릿 준다고 하여 프론트 디자인은 다음주에 탬플릿 적용해볼 것.  

# 고민
게시글 수정에서 업로드한 파일도 수정 할 때에 서버에 올라간 파일의 중복 처리  
결론 - 해당 게시글의 파일을 모두 삭제한뒤 새로 업로드 한다. 로 결정   

게시글 수정에서 동시성 문제(수정중 조회수 같은것들) 고민을 해보자.  

# 작업 히스토리
23.10.28  
목표
대댓글
댓글 알림 

달성
댓글 crud 완성

------------------------------------------------------------------------------------------------------------
23.10.27  
게시판 crud완성

------------------------------------------------------------------------------------------------------------
23.10.26  
프로젝트 생성.  
이전 연습에서 썻던 코드를 가져와서 수정함  
스프링 시큐리티 적용.  
jwt filter, service 적용.  
로그인/ 회원가입 기능 완료.  

# 작업 중 발생한 에러
ERROR 24656 --- [nio-8080-exec-3] o.h.engine.jdbc.spi.SqlExceptionHelper   : Statement.executeQuery() cannot issue statements that do not produce result sets.
발생 상황 - 쿼리 어노테이션을 select문 이외에(쿼리의 결과가 집합으로 표현될 수 없을때) 사용했을 때.
예시 - update문, delete문 등
해결 방법 - 쿼리 어노테이션 위에 @Modifying, @Transactional을 추가해주면 해결된다.
이유 - 기본적으로 하이버네이트는 데이터를 반환 하려 하는데, update 같은 경우에는 반환되는 데이터가 없음. 결과만 반환됨.
    따라서 @Modifying을 사용하여 반환되는 데이터가 없음을 알려준다.
    @Transactional을 추가하는 이유는 작업을 하나의 트랜잭션으로 만들어 데이터의 일관성을 보장하기 위해서.