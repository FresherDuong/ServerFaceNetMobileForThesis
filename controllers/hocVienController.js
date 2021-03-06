const HocVien = require('./../models/hocvienModel');
const Log = require('./../models/logModel');
const catchAsync = require('./../utils/catchAsync');

exports.getStudentInfoByIdentity = catchAsync(async (req, res, next) => {
  const dataHocVien = await HocVien.find({
    cmnd: req.params.identity
  }).populate({
    path: 'idLop',
    select: 'tenLop khaiGiang idGiangVien idLoaiBang -_id'
  });

  if (dataHocVien.length !== 0) {
    const dataLog = await Log.aggregate([
      {
        $match: {
          idHocVien: dataHocVien[0]._id
        }
      },
      {
        $group: {
          _id: 'idHocVien',
          numOfTime: { $sum: '$totalTime' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      totalTime: dataLog.length === 0 ? 0 : dataLog[0].numOfTime,
      data: dataHocVien[0]
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Cant find student with provided identity !'
    });
  }
});

exports.updateStudentEmbedding = catchAsync(async (req, res, next) => {
  const { id, embeddings } = req.body;
  const data = await HocVien.findByIdAndUpdate(
    id,
    { embedding: embeddings, status : 3 },
    { new: true }
  );

  if (data) {
    res.status(200).json({
      status: 'success',
      data: data.embedding
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Can not find student with this id provided !'
    });
  }
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.idClass) filter = { idLop: req.params.idClass };

  let fields = '';
  let { getEmbedding } = req.query;
  if (getEmbedding === 'true') {
    fields = 'ten embedding _id';
    filter = { ...filter, embedding: { $ne: null } };
  } else if (getEmbedding === 'false') {
    fields = 'ten ngaySinh cmnd sdt pickUpLocation';
  }

  const data = await HocVien.find(filter).select(fields);

  res.status(200).json({
    status: 'success',
    result: data.length,
    data
  });
});
exports.getStudentInfo = catchAsync(async (req, res, next) => {
  try {
    const data = await HocVien.find({ id: req.params.id });
    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

exports.dangKyOnline = catchAsync(async (req, res, next) => {
  try {
    const dataCreated = await HocVien.create(req.body);
    res.status(200).send('success');
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

exports.setAppointment = catchAsync(async (req, res, next) => {
  try {
    let result = await HocVien.findOneAndUpdate(
      { _id: req.body._id },
      {
        ngayHen: req.body.ngayHen,
        ghiChu: req.body.ghiChu,
        status: 2,
        pending: false
      },
      {
        rawResult: true // Return the raw result from the MongoDB driver
      }
    );
    if (result.lastErrorObject.updatedExisting) {
      res.status(200).send('success');
    } else {
      res.status(400).send('update fail!');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

exports.updateStudentLocation = catchAsync(async (req, res, next) => {
  const { location } = req.body;
  const { id } = req.params;
  const data = await HocVien.findByIdAndUpdate(
    id,
    { pickUpLocation: location },
    { new: true }
  );

  if (data) {
    res.status(200).json({
      status: 'success',
      data: data.pickUpLocation
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Can not find student with this id provided !'
    });
  }
});

exports.setLop = catchAsync(async (req, res, next) => {
  try {
    let result = await HocVien.findOneAndUpdate(
      { _id: req.body._id },
      {
        idLop: req.body.idLop,
        status : 4
      },
      {
        rawResult: true // Return the raw result from the MongoDB driver
      }
    );
    if (result.lastErrorObject.updatedExisting) {
      res.status(200).send('success');
    } else {
      res.status(400).send('update fail!');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    let result = await HocVien.find({ pending: false });
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


exports.giayto = catchAsync(async (req, res, next) => {
  try {
    console.log('ok')
    let result = await HocVien.findOneAndUpdate(
      { _id: req.body._id },
      {
        hasCmnd : req.body.hasCmnd,
        hasGksk : req.body.hasGksk,
        hasSyll : req.body.hasSyll,
        hasGplx : req.body.hasGplx,
        hasAnh :  req.body.hasAnh,
        hasDongdangky : req.body.hasDongdangky,
      },
      {
        rawResult: true // Return the raw result from the MongoDB driver
      }
    );
    
    if (result.lastErrorObject.updatedExisting) {
      res.status(200).send('success');
    } else {
      res.status(400).send('update fail!');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

exports.setdiem = catchAsync(async (req, res, next) => {
  try {
    let result = await HocVien.findOneAndUpdate(
      { _id: req.body._id },
      {
        diemLT: req.body.diem,
        status: 5,
      },
      {
        rawResult: true // Return the raw result from the MongoDB driver
      }
    );
    if (result.lastErrorObject.updatedExisting) {
      res.status(200).send('success');
    } else {
      res.status(400).send('update fail!');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
})