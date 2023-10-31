package com.example.web.model.entity;

import com.example.web.model.common.BaseTimeEntity;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Entity
@Table(name="FILE")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@DynamicUpdate
// soft delete
//@Where(clause = "DELETE_YN = 'N'")
//@SQLDelete(sql = "UPDATE FILE SET DELETE_YN = 'Y', DELETE_TIME=NOW() WHERE FID = ?")
public class File extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fid;
    @Lob
    private byte[] fileData;
    private String fileName;
    private String fileType;
    private Long bid;
    @Column(columnDefinition = "boolean default false")
    private Boolean isImage;
    private String writer;
}
